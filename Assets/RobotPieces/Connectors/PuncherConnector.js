﻿#pragma strict

public var rotationGrabberType : GameObject;
public var reloadTime : float;
public var punchingArm : GameObject;
public var relatedBM : BattleManager;
private var loaded = true;

public class PuncherConnector extends Connector
{
	function Connect (blockObject : GameObject , attachPoint : Vector3, attachDirection : Vector3){
		var worldSpaceSide : Vector3 = blockObject.transform.TransformPoint(attachPoint);
		var worldSpaceDir : Vector3 = blockObject.transform.TransformDirection(attachDirection);
		
		transform.position = worldSpaceSide;
		transform.rotation = Quaternion.LookRotation(worldSpaceDir,Vector3(worldSpaceDir.y,worldSpaceDir.z,worldSpaceDir.x));
		transform.position += .5 * worldSpaceDir;
		
		var machinePieceInfo : MachinePieceAttachments = GetComponent("MachinePieceAttachments");
		for(var currObj : GameObject in machinePieceInfo.connectedObjects)
			currObj = blockObject;
			
		transform.parent = blockObject.transform;
		
		gameObject.AddComponent(KeyBindedActivator).key = "1";
		loaded = true;
	}
	
	function rotatePieceGeneric()
	{
		// destroy other rotation grabbers and create a new rotation grabber for this object
		GameObject.Destroy(GameObject.Find("RotationGrabberObject"));
			
		var rGrabber : GameObject = Instantiate(rotationGrabberType,transform.TransformPoint(Vector3(0,4,0)),Quaternion.identity);
		var rGrabberData : RotationGrabber = rGrabber.GetComponent("RotationGrabber");
		rGrabberData.radius = 4;
		rGrabberData.anchorPoint = transform.position;
		//rGrabberData.rotationAxis = transform.TransformDirection(Vector3.forward);
		rGrabberData.rotationAxis = Vector3.forward;
		rGrabberData.grabbedObj = this;
		
		rGrabber = Instantiate(rotationGrabberType,transform.TransformPoint(Vector3(4,0,0)),Quaternion.identity);
		rGrabberData = rGrabber.GetComponent("RotationGrabber");
		rGrabberData.radius = 4;
		rGrabberData.anchorPoint = transform.position;
		//rGrabberData.rotationAxis = transform.TransformDirection(Vector3.right);
		rGrabberData.rotationAxis = Vector3.up;
		rGrabberData.grabbedObj = this; 
		
		DrawRotationArrow();
	}
	
	function rotate(angleToRotate: float, axis : Vector3)
	{
		// rotate around the hinge joint
		var anchorPoint : Vector3 = Vector3.zero;
		transform.RotateAround(transform.TransformPoint(anchorPoint),axis,-angleToRotate);
		rigidbody.angularVelocity = Vector3.zero;
		
		DrawRotationArrow();
	}
	
	function DrawRotationArrow()
	{
		DrawArrow(transform.position,2*transform.TransformDirection(Vector3.up),Color(1,1,1));
	}
	
	function Activate()
	{
		if(loaded)
		{
			loaded = false;
			
			punchingArm.transform.localPosition += 2*Vector3.up;
			relatedBM.damageEnabled = true;
			
			StartCoroutine("Reload");
		}
	}
	
	function Reload()
	{
		yield WaitForSeconds(reloadTime);
		loaded = true;
		punchingArm.transform.localPosition += 2*Vector3.down;
		relatedBM.damageEnabled = false;
	}
}